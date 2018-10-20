package tech.ananas.services;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.springframework.format.datetime.standard.DateTimeFormatterFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import tech.ananas.models.Flight;
import tech.ananas.models.FlightAlternatives;
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

	public boolean updateTrip(Route route) throws ParseException, IOException {
		if (route.getCities().size() == 0) {
			return true;
		}

		Iterator<String> city = route.getCities().iterator();
		String previousCity = city.next();
		LocalDate startingDate = LocalDate.parse(route.getEarliestDeparture());

		List<FlightAlternatives> alternatives = new LinkedList<>();

		while (city.hasNext()) {
			String currentCity = city.next();

			if (!ignoreFlight(previousCity, currentCity, route.getIgnoreFlight())) {
				if (!fetchFlights(previousCity, startingDate, alternatives, currentCity)) {
					return false;
				}
			}
			startingDate = startingDate.plusDays(route.getDurationOfStay().get(currentCity));
			previousCity = currentCity;
		}
		// fly back to start!
		fetchFlights(previousCity, startingDate, alternatives, route.getCities().get(0));

		Trip t = new Trip(alternatives);
		route.setTrip(t);
		return true;
	}

	private boolean fetchFlights(String previousCity, LocalDate startingDate, List<FlightAlternatives> alternatives,
			String currentCity) throws IOException {
		try {
		String formattedDate = startingDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		String url = this.api.createSession(previousCity, currentCity, formattedDate);
		if (url == null) {
			return false;
		}
		System.out.println(url);
		List<Flight> flights = this.api.getFlight(url);
		FlightAlternatives alternative = new FlightAlternatives(previousCity, currentCity, flights);
		alternatives.add(alternative);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	private boolean ignoreFlight(String previousCity, String currentCity, List<List<String>> ignoreFlight) {
		if (ignoreFlight == null) {
			return false;
		}

		for (List<String> ignore: ignoreFlight) {
			if (ignore.contains(previousCity) && ignore.contains(currentCity)) {
				return true;
			}
		}
		return false;
	}

	private Place findPlaceById(Long id, BrowseQuotes quotes) {
		for (Place p : quotes.Places) {
			if (p.PlaceId == id) {
				return p;
			}
		}
		return null;
	}

	private Carrier findCarrierForId(Long long1, BrowseQuotes quotes) {
		for (Carrier c : quotes.Carriers) {
			if (c.CarrierId == long1) {
				return c;
			}
		}
		return null;
	}

}
