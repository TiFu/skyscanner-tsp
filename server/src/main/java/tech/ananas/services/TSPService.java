package tech.ananas.services;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.TreeMap;

import tech.ananas.models.Route;
import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.sky.BrowseQuotes;
import tech.ananas.sky.Quote;
import tech.ananas.tsp.PartialRouteState;

public class TSPService {
	private SkyscannerAPI skyAPI;
	private TreeMap<Double,LinkedList<String>> results;
	private SubmitCityListRequest cityListRequest;
	
	public TSPService() {
		
	}
	
	public TreeMap<Double,LinkedList<String>> TSPpaths(String apiKey, SubmitCityListRequest cityListRequest) {
		skyAPI = new SkyscannerAPI(apiKey);
		results = new TreeMap<Double,LinkedList<String>>();
		this.cityListRequest = cityListRequest;
		
		PartialRouteState initial = new PartialRouteState(this, null, cityListRequest.getStartingCity(), 0);
		System.out.println(results);		
		return results;
	}
	
	public Route TSProute () { //input path, convert to Route
		
		return null;
		
	}
	
	public double getPrice(String originPlace, String destinationPlace, String outboundPartialDate) {
		try {
			BrowseQuotes quotes = skyAPI.getQuotes(originPlace, destinationPlace, outboundPartialDate);
			Iterator<Quote> iter = quotes.Quotes.iterator();
			Quote first = iter.next();
			return first.MinPrice;
		} catch (IOException e) {
			e.printStackTrace();
			return 0.0;
		}
	}
	
	public int getDuration(String city) {
		return cityListRequest.getDurationOfStay().get(city);
	}
	
	public SkyscannerAPI getSkyAPI() {
		return skyAPI;
	}

	public TreeMap<Double, LinkedList<String>> getResults() {
		return results;
	}

	public SubmitCityListRequest getCityListRequest() {
		return cityListRequest;
	}
}
