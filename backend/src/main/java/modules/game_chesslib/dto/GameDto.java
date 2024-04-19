package modules.game_chesslib.dto;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import common.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameDto {
    String id;
    GameStatus status;
    int player1Id;
    int player2Id;
    String createdAt;
    RuleSetDto ruleSetDto;

    public GameDto(ResultSet rs) throws JsonMappingException, JsonProcessingException, SQLException {
        id = rs.getString("id");
        status = GameStatus.fromInt(rs.getInt("status"));
        player1Id = rs.getInt("player1_id");
        player2Id = rs.getInt("player2_id");
        createdAt = rs.getTimestamp("created_at").toString();
        Gson gson = new Gson();
        ruleSetDto = new RuleSetDto(rs.getInt("ruleset_id"),
                rs.getString("name"),
                gson.fromJson(rs.getString("detail"), JsonObject.class),
                gson.fromJson(rs.getString("description"), JsonObject.class),
                rs.getBoolean("published"));
    }
}
