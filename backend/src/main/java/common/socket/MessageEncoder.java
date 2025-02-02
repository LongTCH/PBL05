package common.socket;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;

public class MessageEncoder implements Encoder.Text<SocketMessageDto> {

    @Override
    public String encode(SocketMessageDto message) throws EncodeException {
        Gson gson = new Gson();
        return gson.toJson(message);
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }

}
