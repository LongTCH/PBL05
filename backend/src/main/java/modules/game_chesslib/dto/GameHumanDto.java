package modules.game_chesslib.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameHumanDto implements GamePlayerDto {
    int id;
    String displayName;
    int elo;
    String avatarUrl;
    boolean white;
}
