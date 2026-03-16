package com.BrainBubble.backend.dto.board;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BoardResponse {
    private UUID id;
    private String title;
    private String graphData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}