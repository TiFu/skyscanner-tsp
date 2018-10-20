package tech.ananas.services;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
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
	
	public TSPService(SkyscannerAPI skyAPI) {
		this.skyAPI = skyAPI;
	}
	
	public TreeMap<Double,LinkedList<String>> TSPpath(SubmitCityListRequest cityListRequest) {
		results = new TreeMap<Double,LinkedList<String>>();
		//results.put(9999999999.9, null);
		this.cityListRequest = cityListRequest;
		
		PartialRouteState initial = new PartialRouteState(this, null, cityListRequest.getStartingCity(), 0);
		System.out.println(results);		
		return results;
	}
	
	public Route TSProute (SubmitCityListRequest cityListRequest) { //input Submit, convert to Route
		List<String> orderedCities = TSPpath(cityListRequest).firstEntry().getValue();
		Route outputRoute = new Route("tsp", null, orderedCities, cityListRequest.getDurationOfStay());
		return outputRoute;
		
	}
	
	public double getPrice(String originPlace, String destinationPlace, String outboundPartialDate) {
		try {
			BrowseQuotes quotes = skyAPI.getQuotes(originPlace, destinationPlace, outboundPartialDate);
			Iterator<Quote> iter = quotes.Quotes.iterator();
			System.out.println(quotes.Quotes.size());
			if (quotes.Quotes.size() > 0) {
				Quote first = iter.next();
				return first.MinPrice;
			} else {
				return Double.POSITIVE_INFINITY;
			}
		} catch (IOException e) {
			e.printStackTrace();
			return Double.POSITIVE_INFINITY;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Double.POSITIVE_INFINITY;
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
