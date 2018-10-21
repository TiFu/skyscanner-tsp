package tech.ananas.sky;

import java.io.Serializable;
import java.util.List;

public class BrowseQuotes implements Serializable {
	@Override
	public String toString() {
		return "BrowseQuotes [quotes=" + Quotes + ", places=" + Places + ", carriers=" + Carriers + "]";
	}
	public List<Quote> Quotes;
	public List<Place> Places;
	public List<Carrier> Carriers;
}
