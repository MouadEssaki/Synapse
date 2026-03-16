package com.BrainBubble.backend.service;

import com.BrainBubble.backend.dto.board.BoardRequest;
import com.BrainBubble.backend.dto.board.BoardResponse;
import com.BrainBubble.backend.model.Board;
import com.BrainBubble.backend.model.User;
import com.BrainBubble.backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    // ── Get all ───────────────────────────────────────────────────────────

    public List<BoardResponse> getAllBoards(User user) {
        return boardRepository
                .findAllByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Get one ───────────────────────────────────────────────────────────

    public BoardResponse getBoard(UUID boardId, User user) {
        Board board = findBoardOwnedByUser(boardId, user.getId());
        return toResponse(board);
    }

    // ── Create ────────────────────────────────────────────────────────────

    @Transactional
    public BoardResponse createBoard(BoardRequest request, User user) {
        Board board = Board.builder()
                .title(request.getTitle())
                .graphData("{\"nodes\":[],\"edges\":[]}")
                .user(user)
                .build();

        boardRepository.save(board);
        return toResponse(board);
    }

    // ── Update ────────────────────────────────────────────────────────────

    @Transactional
    public BoardResponse updateBoard(UUID boardId, BoardRequest request, User user) {
        Board board = findBoardOwnedByUser(boardId, user.getId());

        if (request.getTitle() != null) {
            board.setTitle(request.getTitle());
        }
        if (request.getGraphData() != null) {
            board.setGraphData(request.getGraphData());
        }

        boardRepository.save(board);
        return toResponse(board);
    }

    // ── Delete ────────────────────────────────────────────────────────────

    @Transactional
    public void deleteBoard(UUID boardId, User user) {
        Board board = findBoardOwnedByUser(boardId, user.getId());
        boardRepository.delete(board);
    }

    // ── Internal ──────────────────────────────────────────────────────────

    private Board findBoardOwnedByUser(UUID boardId, UUID userId) {
        return boardRepository.findByIdAndUserId(boardId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Board not found"
                ));
    }

    private BoardResponse toResponse(Board board) {
        return BoardResponse.builder()
                .id(board.getId())
                .title(board.getTitle())
                .graphData(board.getGraphData())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
}