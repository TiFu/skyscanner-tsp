package tech.ananas.services;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.time.LocalDate;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
		this.cityListRequest = cityListRequest;
		
		PartialRouteState initial = new PartialRouteState(this, null, cityListRequest.getStartingCity(), 0);
		System.out.println(results);		
		return results;
	}
	
	public Route TSProute (SubmitCityListRequest cityListRequest) {
		List<String> orderedCities = TSPpath(cityListRequest).firstEntry().getValue();
		// flight back!
		orderedCities.remove(orderedCities.size() - 1);
		Route outputRoute = new Route("tsp", null, orderedCities, cityListRequest.getDurationOfStay());
		Set<String> citySet = new HashSet<>(orderedCities);
		return outputRoute;
		
	}
	
	public void greedyTSPbenchmark(SubmitCityListRequest cityListRequest) {
		this.cityListRequest = cityListRequest;
		List<String> cityList = cityListRequest.getCities();
		cityList.add(0, cityListRequest.getStartingCity());
		
		LinkedList<String> greedyCities = new LinkedList<>();
		LinkedList<String> leftoverCities = new LinkedList<>();
		leftoverCities.addAll(cityList);
		greedyCities.add(cityList.get(0));
		leftoverCities.remove(cityList.get(0));
		
		String helpDate = cityListRequest.getEarliestDeparture();
		double greedyPrice = 0.0;
		
		while (!leftoverCities.isEmpty()) {
			String cheapestNext = "";
			Double cheapestPrice = Double.POSITIVE_INFINITY;
			for (String help: leftoverCities) {
				 Double newPrice = getPrice(greedyCities.getLast(), help, helpDate);
				 if (newPrice < cheapestPrice) {
					 cheapestPrice = newPrice;
					 cheapestNext = help;
				 }
			}
			greedyCities.addLast(cheapestNext);
			leftoverCities.remove(cheapestNext);
			greedyPrice = greedyPrice + cheapestPrice;
			helpDate = ""+ LocalDate.parse(helpDate).plusDays(getDuration(cheapestNext));
			
			boolean isFound = false;
			String neighbor = "";
			for(int x = 0; x < cityListRequest.getIgnoreFlight().size(); x++) {
			   LinkedList<String> xlist = (LinkedList<String>) cityListRequest.getIgnoreFlight().get(x);
				   if (xlist.contains(cheapestNext)) {
				         isFound = true;
				         if (xlist.getFirst().equals(cheapestNext)) {
				        	 neighbor = xlist.getLast();
				        	 break;
				         } else {
				        	 neighbor = xlist.getFirst();
				        	 break;
				         }
				   }  
			}
			if (isFound) {
				greedyCities.addLast(neighbor);
				leftoverCities.remove(neighbor);
				helpDate = ""+ LocalDate.parse(helpDate).plusDays(getDuration(neighbor));
			}
			
			System.out.println(greedyCities);
			System.out.println(greedyPrice);
		}
	}
	
	/*
	public void greedyTSP(SubmitCityListRequest cityListRequest) {
		//get n² prices
		//save in String[][]
		this.cityListRequest = cityListRequest;
		List<String> cityList = cityListRequest.getCities();
		cityList.add(0, cityListRequest.getStartingCity());
		Double[][] priceMatrice = new Double[cityList.size()][cityList.size()];
		
		for (String city1: cityList) {
			for (String city2: cityList) {
				if (!city1.equals(city2)) {
					System.out.println(city1 + " - " + city2);
					//System.out.println(cityList.indexOf(city1) + " - " + cityList.indexOf(city2) + " - " + comparisonPrice(city1, city2));
					priceMatrice[cityList.indexOf(city1)][cityList.indexOf(city2)] = comparisonPrice(city1, city2);
				}
			}
		}
		
		//setze Distanz = 0 wenn ignore
		// using classical for loop
		for(int x = 0; x < cityListRequest.getIgnoreFlight().size(); x++) {
		   LinkedList<String> xlist = (LinkedList<String>) cityListRequest.getIgnoreFlight().get(x);
		   // using for each
		   priceMatrice[cityList.indexOf(xlist.getFirst())][cityList.indexOf(xlist.getLast())] = 0.0;
		   priceMatrice[cityList.indexOf(xlist.getLast())][cityList.indexOf(xlist.getFirst())] = 0.0;
		}
		
		for(int i = 0; i < cityList.size(); i++) {
		      for(int j = 0; j < cityList.size(); j++) {
		         System.out.print("\t\t " + priceMatrice[i][j]);
		      }
		      System.out.println();
		}
		
		//create Route with cheapest Flight
		LinkedList<String> greedyCities = new LinkedList<>();
		LinkedList<String> leftoverCities = new LinkedList<>();
		leftoverCities.addAll(cityList);
		greedyCities.add(cityList.get(0));
		leftoverCities.remove(cityList.get(0));
		
		System.out.println(leftoverCities);
					if (quotes.Quotes.size() > 0) {
						Quote first = iter.next();{
						return first.MinPrice;
					} else {s.getLast());
						return Double.POSITIVE_INFINITY;
					}POSITIVE_INFINITY;
				} catch (IOException e) {es) {
					e.printStackTrace();trice[cityList.indexOf(greedyCities.getLast())][cityList.indexOf(help)];
					return Double.POSITIVE_INFINITY;ice) {
				} catch (Exception e) {ice;
					// TODO Auto-generated catch block
					e.printStackTrace();
					return Double.POSITIVE_INFINITY;
			greedyCities.add(cheapestNext);
			leftoverCities.remove(cheapestNext);
			
			System.out.println(greedyCities);
		}
		
		//price for route
		
		String helpDate = cityListRequest.getEarliestDeparture();
		Double greedyPrice = 0.0;
		String prev = "";
		for(String helpCity: greedyCities) {
			if (prev.equals("")) {
				prev = helpCity;
			} else {
				if (priceMatrice[cityList.indexOf(prev)][cityList.indexOf(helpCity)] > 0.0) {
					greedyPrice = greedyPrice + getPrice(prev, helpCity, helpDate);
				} else {
					;
				}
				System.out.println(greedyPrice);
				prev = helpCity;
				helpDate = ""+ LocalDate.parse(helpDate).plusDays(getDuration(helpCity));
			}
		}		
	} */
	
	//compare greedy that uses direct calls
	
	public double comparisonPrice(String originPlace, String destinationPlace) {
		String date1 = ""+ LocalDate.now().plusDays(7);
		//System.out.println("date: " + date1);
		String date2 = ""+ LocalDate.now().plusDays(19);
		//String date3 = ""+ LocalDate.now().plusDays(29);
		
		double price1 = getPrice(originPlace, destinationPlace, date1);
		double price2 = getPrice(originPlace, destinationPlace, date2);
		//double price3 = getPrice(originPlace, destinationPlace, date3);
		//System.out.println(price1 + " - " + price2 + " - ");
		//System.out.println((price1 + price2 + price3)/3);
		return (price1 + price2)/2;
	}
	
	public double getPrice(String originPlace, String destinationPlace, String outboundPartialDate) {
		try {
			BrowseQuotes quotes = skyAPI.getQuotes(originPlace, destinationPlace, outboundPartialDate);
			Iterator<Quote> iter = quotes.Quotes.iterator();
			//System.out.println(quotes.Quotes.size());
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
