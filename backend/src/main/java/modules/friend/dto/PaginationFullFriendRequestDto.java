package modules.friend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaginationFullFriendRequestDto {
    List<FullFriendRequestDto> requests;
    int totalPages;
    int totalElements;
}
