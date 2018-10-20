package tech.ananas.services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import tech.ananas.models.Route;
import tech.ananas.sky.Quote;
import tech.ananas.sky.request.QuoteRequest;


public class FlightsService {
    public FlightsService() {
    }

    public void updateTrip(Route route) {
    }

    public static void testSkyScannerApi() {
        RestTemplate template = new RestTemplate();
        String url = "";

        QuoteRequest request = new QuoteRequest();
        request.apiKey = "ha973240724713587943361464989493";
        request.country = "CZ";
        request.currency = "EUR";
        request.originPlace = "PARI-sky";
        request.destinationPlace = "CDG-sky";
        request.outboundPartialDate = "anytime";

        Quote response;
        HttpEntity<QuoteRequest> requestEntity = new HttpEntity<QuoteRequest>(request);
        try {
            ResponseEntity<Quote> quote = template.exchange(url, HttpMethod.POST, requestEntity, Quote.class);
            response = quote.getBody();
            System.out.println("yay");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
