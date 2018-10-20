package tech.ananas.services;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import tech.ananas.models.Flight;
import tech.ananas.models.Leg;
import tech.ananas.models.Route;
import tech.ananas.models.Trip;
import tech.ananas.sky.BrowseQuotes;
import tech.ananas.sky.Carrier;
import tech.ananas.sky.Place;
import tech.ananas.sky.Quote;
import tech.ananas.sky.request.QuoteRequest;


public class FlightsService {
	private SkyscannerAPI api;
	
    public FlightsService(SkyscannerAPI api) {
    	this.api = api;
    }

    public void updateTrip(Route route) throws ParseException, IOException {
    	// nothing
    }
    
    private Place findPlaceById(Long id, BrowseQuotes quotes) {
    	for (Place p: quotes.Places) {
    		if (p.PlaceId == id) {
    			return p;
    		}
    	}
    	return null;
    }
    
    private Carrier findCarrierForId(Long long1, BrowseQuotes quotes) {
    	for (Carrier c: quotes.Carriers) {
    		if (c.CarrierId == long1) {
    			return c;
    		}
    	}
		return null;
    }
    
}
