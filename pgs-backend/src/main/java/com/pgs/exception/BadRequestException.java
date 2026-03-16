package com.pgs.exception;
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}
