package tech.ananas.tsp;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.services.SkyscannerAPI;
import tech.ananas.services.TSPService;
import tech.ananas.sky.BrowseQuotes;
import tech.ananas.sky.Quote;

public class TSPTest {
	
	public static void main(String[] args) {

		//TODO: heuristics
		//TODO: quotes into details (output Route :3)

		SkyscannerAPI skyAPI = new SkyscannerAPI("ha973240724713587943361464989493");
		TSPService test = new TSPService(skyAPI);	
		test.TSPpath(createSampleRoute());
	}
	
	public static SubmitCityListRequest createSampleRoute() {
		String startingCity = "BCN";
		String departure = "2018-10-30";
		List<String> cities = new LinkedList<String>();
		Map<String,Integer> durationOfStay = new HashMap<String,Integer>();
		
		cities.add("FRA");
		durationOfStay.put("FRA", 3);
		
		cities.add("PRG");
		durationOfStay.put("PRG", 4);
		
		cities.add("FCO");
		durationOfStay.put("FCO", 5);
		
		cities.add("LHR");
		durationOfStay.put("LHR", 4);
		
		cities.add("PMO");
		durationOfStay.put("PMO", 2);
		
		//List<List<String>> ignoreFlight
		List<String> ignored = new LinkedList<String>();
		ignored.add("FCO");
		ignored.add("PMO");
		List<List<String>> ignoreList = new LinkedList<>();
		ignoreList.add(ignored);
		
		System.out.println(ignoreList);
		
		return new SubmitCityListRequest(startingCity, departure, cities, ignoreList, durationOfStay);
	}
}
