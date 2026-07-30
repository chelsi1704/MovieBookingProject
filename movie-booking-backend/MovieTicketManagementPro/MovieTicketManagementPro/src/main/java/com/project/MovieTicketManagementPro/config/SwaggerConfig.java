package com.project.MovieTicketManagementPro.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    public OpenAPI openAPI(){
            return new OpenAPI()
                    .info(new Info()
                            .title("Movie Booking System API")
                            .description("Complete REST API for the Movie Booking System " +
                                    "— covers auth, movies, theaters, bookings, and payments")
                            .version("1.0.0")
                            .contact(new Contact()
                                    .name("Your Name")
                                    .email("your@email.com")))
                    .addSecurityItem(new SecurityRequirement()
                            .addList("Bearer Authentication"))
                    .components(new Components()
                            .addSecuritySchemes("Bearer Authentication",
                                    new SecurityScheme()
                                            .type(SecurityScheme.Type.HTTP)
                                            .scheme("bearer")
                                            .bearerFormat("JWT")
                                            .description("Enter your JWT access token here. " +
                                                    "Get it from POST /api/auth/login"))
                    );
    }
}
