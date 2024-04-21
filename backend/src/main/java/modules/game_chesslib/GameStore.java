package modules.game_chesslib;

import java.util.Collections;
import java.util.Map;
import java.util.WeakHashMap;

import modules.game_chesslib.custom.ChessGame;

public class GameStore {
    static volatile GameStore instance;

    public static GameStore getInstance() {
        return instance;
    }

    private GameStore() {
    }

    static {
        instance = new GameStore();
    }
    private Map<String, ChessGame> gameMap = Collections.synchronizedMap(new WeakHashMap<>());

    public ChessGame getGameById(String id) {
        return gameMap.get(id);
    }

    public boolean isGameExist(String id) {
        return gameMap.containsKey(id);
    }

    public void addGame(ChessGame chessGame) {
        gameMap.put(chessGame.getId(), chessGame);
    }
}
