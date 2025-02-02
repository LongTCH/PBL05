import { path } from 'src/constants/path'
import { PoliciesOption } from 'src/data/auth'
import { FaComments, FaHome, FaUserFriends } from 'react-icons/fa';

import { IconType } from 'react-icons'

export interface QuickOptionNavbar extends PoliciesOption {
}
export interface SidebarOption extends QuickOptionNavbar {
  icon: IconType
}

export const quickOptionsNavbar: QuickOptionNavbar[] = [
  {
    id: 1,
    title: 'Profile',
    to: path.profile
  },
]

export const sidebarOption: SidebarOption[] = [
  {
    id: 1,
    title: 'Home',
    to: path.home,
    icon: FaHome
  },
  {
    id: 2,
    title: 'Messages',
    to: path.chat,
    icon: FaComments
  },
  {
    id: 3,
    title: 'Friends',
    to: path.friend,
    icon: FaUserFriends
  }
]

export const publicSidebarOption: SidebarOption[] = [
  {
    id: 1,
    title: 'Home',
    to: path.home,
    icon: FaHome
  },
]