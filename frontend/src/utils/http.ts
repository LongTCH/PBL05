import axios, { AxiosError, type AxiosInstance } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getProfileFromLS,
  getRefreshTokenFromLS,
  getSessionIdFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS,
  setSessionIdToLS
} from 'src/utils/auth'
import { LoginResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from 'src/apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from 'src/utils/utils'
import { SECONDS_IN_DAY } from 'src/constants/common'
import config from 'src/configs'
import { ErrorResponse } from 'src/types/utils.type'
import { User } from 'src/types/users.type'

export class Http {
  instance: AxiosInstance
  // private accessToken: string
  // private refreshToken: string
  private jsessionid: string
  // private user: User
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    // this.accessToken = getAccessTokenFromLS()
    // this.refreshToken = getRefreshTokenFromLS()
    this.jsessionid = getSessionIdFromLS()
    // this.user = getProfileFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': SECONDS_IN_DAY,
        'expire-refresh-token': SECONDS_IN_DAY * 160
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.jsessionid && config.headers) {
          config.headers["JSESSIONID"] = this.jsessionid
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN) {
          const data = response.data as LoginResponse
          this.jsessionid = data.sessionId
          // this.user = data.user
          setSessionIdToLS(data.sessionId)
          // setProfileToLS(this.user)
        } else if (url === URL_LOGOUT) {
          this.jsessionid = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        // if (
        //   ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        // ) {
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   const data: any | undefined = error.response?.data
        //   const message = data?.message || error.message
        //   toast.error(message)
        // }

        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpiredTokenError(error) && config?.url !== URL_REFRESH_TOKEN) {
            // Hạn chế gọi 2 lần handleRefreshToken
            // this.refreshTokenRequest = this.refreshTokenRequest
            //   ? this.refreshTokenRequest
            //   : this.handleRefreshToken().finally(() => {
            //       // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
            //       setTimeout(() => {
            //         this.refreshTokenRequest = null
            //       }, 10000)
            //     })
            // return this.refreshTokenRequest.then((accessToken) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
            //   return this.instance({ ...config, headers: { ...config?.headers, authorization: accessToken } })
            // })
          }

          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          clearLS()
          this.jsessionid = ''
         
          // window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }
  // private handleRefreshToken() {
  //   return this.instance
  //     .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
  //       refreshToken: this.refreshToken
  //     })
  //     .then((res) => {
  //       const { accessToken } = res.data.data
  //       setAccessTokenToLS(accessToken)
  //       this.accessToken = accessToken
  //       return accessToken
  //     })
  //     .catch((error) => {
  //       clearLS()
  //       this.accessToken = ''
  //       this.refreshToken = ''
  //       throw error
  //     })
  // }
}
const http = new Http().instance
export default http
