package utils;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ResponseUtils {
    private Gson gson = new Gson();

    public void responseJson(HttpServletResponse response, Object object) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String data = this.gson.toJson(object);
        out.print(data);
        out.flush();
        out.close();
    }

    public void responseMessage(HttpServletResponse response, String message) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("message", message);
        String data = this.gson.toJson(jsonObject);
        out.print(data);
        out.flush();
        out.close();
    }

    public void responseJson(HttpServletResponse response, Object object, int status) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String data = this.gson.toJson(object);
        out.print(data);
        out.flush();
        out.close();
    }
}
