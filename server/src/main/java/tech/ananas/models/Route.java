package tech.ananas.models;

import java.util.Map;

public class Route {
	private String owner;
	private String routeName;
	private String[] cities;
	private String [][] ignoreFlight;
	private Map<String,Integer> durationOfStay;
	private String earliestDeparture;
	private Trip trip;
}
