package tech.ananas.sky;

import java.util.Date;

public class Quote {
    public long QuoteId;
    public long MinPrice;
    public boolean Direct;
    public Leg OutboundLeg;
    public Leg InboundLeg;
    public Date QuoteDateTime;
}
