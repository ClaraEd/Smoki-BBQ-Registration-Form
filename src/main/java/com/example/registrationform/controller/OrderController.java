package com.example.registrationform.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class OrderController {

    @PostMapping("/api/orders")
    public String placeOrder(@RequestBody Map<String, Object> orderDetails) {
        // Here you can process the order and save it to the database
        System.out.println("Order received: " + orderDetails);
        return "Order placed successfully!";
    }
}
