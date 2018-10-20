package tech.ananas.sky;

import java.util.Date;

public class Quote {
    public long QuoteId;
    public long MinPrice;
    public boolean Direct;
    public Leg OutboundLeg;
    public Leg InboundLeg;
    public String QuoteDateTime;
	@Override
	public String toString() {
		return "Quote [QuoteId=" + QuoteId + ", MinPrice=" + MinPrice + ", Direct=" + Direct + ", OutboundLeg="
				+ OutboundLeg + ", InboundLeg=" + InboundLeg + ", QuoteDateTime=" + QuoteDateTime + "]";
	}
}
