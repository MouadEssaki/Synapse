package com.BrainBubble.backend.controller;

import com.BrainBubble.backend.dto.board.BoardRequest;
import com.BrainBubble.backend.dto.board.BoardResponse;
import com.BrainBubble.backend.model.User;
import com.BrainBubble.backend.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardResponse>> getAllBoards(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(boardService.getAllBoards(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoard(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(boardService.getBoard(id, user));
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @RequestBody BoardRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardService.createBoard(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable UUID id,
            @RequestBody BoardRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(boardService.updateBoard(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        boardService.deleteBoard(id, user);
        return ResponseEntity.noContent().build();
    }
}