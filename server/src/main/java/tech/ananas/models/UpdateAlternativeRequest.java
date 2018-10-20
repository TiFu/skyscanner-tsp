package tech.ananas.models;

public class UpdateAlternativeRequest {

	private String id;
	private String routeName;
	private int flightId;
	private int selectedAlternative;
	public String getId() {
		return id;
	}
	public String getRouteName() {
		return routeName;
	}
	public int getFlightId() {
		return flightId;
	}
	public int getSelectedAlternative() {
		return selectedAlternative;
	}
	
}
