package tech.ananas.models;

import java.util.LinkedList;
import java.util.List;

public class Trip {
	private List<FlightAlternatives> flights;
	
	public Trip(Trip t) {
		this.flights = new LinkedList<>();
		for (FlightAlternatives a: t.flights) {
			this.flights.add(new FlightAlternatives(a));
		}
	}
	public Trip(List<FlightAlternatives> flights) {
		this.flights = flights;
	}
	
	public List<FlightAlternatives> getFlights() {
		return flights;
	}
}
