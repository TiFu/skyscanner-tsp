package tech.ananas.spring;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {
    
    @RequestMapping("/")
    public String index() {
    	// TODO: serve resources
        return "Greetings from Spring Boot!";
    }
}
