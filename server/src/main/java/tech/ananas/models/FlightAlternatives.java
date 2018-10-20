package tech.ananas.models;

import java.util.List;

public class FlightAlternatives {
	private String startingCity;
	private String finalDestination;
	private int selectedAlternative;
	private List<Flight> alternatives;
	
	public FlightAlternatives(String startingCity, String finalDestination, List<Flight> alternatives) {
		super();
		this.startingCity = startingCity;
		this.finalDestination = finalDestination;
		this.alternatives = alternatives;
		this.selectedAlternative = 0;
	}
	
	
	public int getSelectedAlternative() {
		return selectedAlternative;
	}


	public void setSelectedAlternative(int selectedAlternative) {
		this.selectedAlternative = selectedAlternative;
	}


	public String getStartingCity() {
		return startingCity;
	}
	public void setStartingCity(String startingCity) {
		this.startingCity = startingCity;
	}
	public String getFinalDestination() {
		return finalDestination;
	}
	public void setFinalDestination(String finalDestination) {
		this.finalDestination = finalDestination;
	}
	public List<Flight> getAlternatives() {
		return alternatives;
	}
	public void setAlternatives(List<Flight> alternatives) {
		this.alternatives = alternatives;
	}

	
}
