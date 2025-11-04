package com.example.backend.model;

// By declaring the enum as 'public' in its own file, it becomes visible
// to all other packages in your application, including your controllers.
public enum AccountStatus {
    PENDING,
    APPROVED,
    REJECTED
}