package tech.ananas.spring;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import tech.ananas.services.FlightsService;
import tech.ananas.services.SessionService;
import tech.ananas.services.SkyscannerAPI;
import tech.ananas.socketio.SocketIO;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
    	SessionService sessionService = new SessionService();
    	System.out.println("Starting");
    	SocketIO socket = new SocketIO("localhost", 8996, sessionService, new FlightsService(new SkyscannerAPI("ha973240724713587943361464989493")));
        SpringApplication.run(Application.class, args);
    }
}
