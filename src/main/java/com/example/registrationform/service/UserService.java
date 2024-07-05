package com.example.registrationform.service;

import com.example.registrationform.model.User;
import com.example.registrationform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) == null) {
            return userRepository.save(user);
        } else {
            throw new UserAlreadyExistsException("Username is already in use");
        }
    }

    public User loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
}