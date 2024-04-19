package modules.game_chesslib.common.nested;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import modules.game_chesslib.custom.MoveHistory;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MoveResponse {
    String fen;
    boolean white;
    List<MoveHistory> moveHistories;
}
