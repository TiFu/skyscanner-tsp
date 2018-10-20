package tech.ananas.models;

import java.util.List;

public class SubmitCityListResponse {
	private String requestId;
	private String routeName;
	private float totalPrice;
	private List<Flight> flights;
	
	public String getRequestId() {
		return requestId;
	}
	
	public String getRouteName() {
		return routeName;
	}
	
	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public void setFlights(List<Flight> flights) {
		this.flights = flights;
	}

	public float getTotalPrice() {
		return totalPrice;
	}
	
	public List<Flight> getFlights() {
		return flights;
	}
}
