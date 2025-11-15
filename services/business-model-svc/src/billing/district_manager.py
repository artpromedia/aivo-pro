"""
District Billing Manager
Enterprise quote generation with volume discounts
"""

from typing import Dict, List
from datetime import datetime, timedelta
import json


class DistrictBillingManager:
    """
    Generate quotes for district/school contracts
    Volume discounts, multi-year terms, add-ons
    """

    def __init__(self, db):
        self.db = db

        # Base pricing (per student per month)
        self.base_pricing = {
            "basic": 500,      # $5.00
            "premium": 800     # $8.00
        }

        # Volume discount tiers
        self.volume_discounts = {
            100: 0.10,     # 10% at 100+ seats
            500: 0.15,     # 15% at 500+ seats
            1000: 0.20,    # 20% at 1,000+ seats
            5000: 0.25,    # 25% at 5,000+ seats
            10000: 0.30    # 30% at 10,000+ seats
        }

        # Multi-year discounts (additional)
        self.term_discounts = {
            12: 0.05,      # +5% for 12 months
            24: 0.10,      # +10% for 24 months
            36: 0.15       # +15% for 36 months
        }

        # Add-ons (one-time or monthly)
        self.add_ons = {
            "professional_development": {
                "name": "Professional Development Package",
                "price": 500000,  # $5,000 one-time
                "type": "one_time",
                "description": "2-day teacher training workshop"
            },
            "dedicated_support": {
                "name": "Dedicated Support Manager",
                "price": 50000,   # $500/month
                "type": "monthly",
                "description": "Priority support with 4-hour response SLA"
            },
            "api_access": {
                "name": "API Access License",
                "price": 100000,  # $1,000 one-time
                "type": "one_time",
                "description": "Full API access for system integration"
            },
            "custom_integration": {
                "name": "Custom SIS Integration",
                "price": 1000000,  # $10,000 one-time
                "type": "one_time",
                "description": "Custom integration with your SIS"
            },
            "data_migration": {
                "name": "Data Migration Service",
                "price": 300000,  # $3,000 one-time
                "type": "one_time",
                "description": "Migration from existing platform"
            }
        }

    async def create_district_quote(
        self,
        district_name: str,
        contact_email: str,
        seat_count: int,
        tier: str = "basic",
        term_months: int = 12,
        add_on_ids: List[str] = None,
        custom_discount: float = None
    ) -> Dict:
        """
        Generate comprehensive district quote
        """

        # Validate inputs
        if tier not in self.base_pricing:
            raise ValueError(f"Invalid tier: {tier}")

        if term_months not in [12, 24, 36]:
            raise ValueError("Term must be 12, 24, or 36 months")

        # Calculate base price
        base_price_per_seat = self.base_pricing[tier]

        # Apply volume discount
        volume_discount = self._calculate_volume_discount(seat_count)

        # Apply term discount
        term_discount = self.term_discounts.get(term_months, 0)

        # Combine discounts (additive)
        total_discount = volume_discount + term_discount

        # Apply custom discount if provided
        if custom_discount:
            total_discount = max(total_discount, custom_discount)

        # Cap discount at 40%
        total_discount = min(total_discount, 0.40)

        # Calculate monthly price per seat
        discounted_price_per_seat = int(
            base_price_per_seat * (1 - total_discount)
        )

        # Calculate subscription totals
        monthly_total = discounted_price_per_seat * seat_count
        annual_total = monthly_total * 12
        contract_total = monthly_total * term_months

        # Process add-ons
        add_ons_detail = []
        one_time_total = 0
        monthly_add_ons_total = 0

        if add_on_ids:
            for add_on_id in add_on_ids:
                if add_on_id not in self.add_ons:
                    continue

                add_on = self.add_ons[add_on_id]

                add_ons_detail.append({
                    "id": add_on_id,
                    "name": add_on["name"],
                    "description": add_on["description"],
                    "price": add_on["price"] / 100,
                    "type": add_on["type"]
                })

                if add_on["type"] == "one_time":
                    one_time_total += add_on["price"]
                else:
                    monthly_add_ons_total += add_on["price"]

        # Calculate grand total
        grand_total = (
            contract_total +
            one_time_total +
            (monthly_add_ons_total * term_months)
        )

        # Generate quote ID
        quote_id = f"QT-{datetime.utcnow().strftime('%Y%m%d')}-{seat_count}"

        # Payment terms
        payment_terms = self._generate_payment_terms(
            contract_total,
            term_months
        )

        # SLA
        sla = self._generate_sla(tier, add_ons_detail)

        # Create quote
        quote = {
            "quote_id": quote_id,
            "district_name": district_name,
            "contact_email": contact_email,
            "created_at": datetime.utcnow().isoformat(),
            "valid_until": (
                datetime.utcnow() + timedelta(days=30)
            ).isoformat(),
            "subscription": {
                "tier": tier,
                "seat_count": seat_count,
                "term_months": term_months,
                "base_price_per_seat": base_price_per_seat / 100,
                "volume_discount": volume_discount,
                "term_discount": term_discount,
                "total_discount": total_discount,
                "final_price_per_seat": discounted_price_per_seat / 100,
                "monthly_total": monthly_total / 100,
                "annual_total": annual_total / 100,
                "contract_total": contract_total / 100
            },
            "add_ons": add_ons_detail,
            "add_ons_total": {
                "one_time": one_time_total / 100,
                "monthly": monthly_add_ons_total / 100,
                "contract_total": (
                    one_time_total +
                    (monthly_add_ons_total * term_months)
                ) / 100
            },
            "grand_total": grand_total / 100,
            "payment_terms": payment_terms,
            "sla": sla,
            "savings": {
                "volume_discount_amount": (
                    base_price_per_seat * seat_count *
                    volume_discount * term_months / 100
                ),
                "term_discount_amount": (
                    base_price_per_seat * seat_count *
                    term_discount * term_months / 100
                ),
                "total_savings": (
                    base_price_per_seat * seat_count *
                    total_discount * term_months / 100
                )
            }
        }

        # Save quote to database
        await self._save_quote(quote)

        return quote

    def _calculate_volume_discount(self, seat_count: int) -> float:
        """Calculate volume discount tier"""

        discount = 0.0

        for tier_seats, tier_discount in sorted(
            self.volume_discounts.items(),
            reverse=True
        ):
            if seat_count >= tier_seats:
                discount = tier_discount
                break

        return discount

    def _generate_payment_terms(
        self,
        contract_total: int,
        term_months: int
    ) -> Dict:
        """Generate payment terms"""

        # Default: Net 30
        # For large contracts, offer installments

        if contract_total > 10000000:  # > $100K
            # Quarterly payments
            installment_count = term_months // 3
            installment_amount = contract_total / installment_count

            return {
                "type": "installments",
                "net_days": 30,
                "installment_count": installment_count,
                "installment_amount": installment_amount / 100,
                "description": (
                    f"Quarterly payments of ${installment_amount/100:,.2f} "
                    f"(Net 30)"
                )
            }
        else:
            # Annual or upfront
            return {
                "type": "annual",
                "net_days": 30,
                "description": "Annual payment (Net 30)"
            }

    def _generate_sla(
        self,
        tier: str,
        add_ons: List[Dict]
    ) -> Dict:
        """Generate SLA terms"""

        # Base SLA
        if tier == "premium":
            uptime = "99.9%"
            support_response = "4 hours"
        else:
            uptime = "99.5%"
            support_response = "24 hours"

        # Enhanced support if add-on included
        has_dedicated_support = any(
            a["id"] == "dedicated_support" for a in add_ons
        )

        if has_dedicated_support:
            support_response = "2 hours (dedicated manager)"

        return {
            "uptime_guarantee": uptime,
            "support_response_time": support_response,
            "data_retention": "7 years",
            "backup_frequency": "Daily",
            "disaster_recovery": "24-hour RTO",
            "security_compliance": "SOC 2 Type II, FERPA"
        }

    async def _save_quote(self, quote: Dict):
        """Save quote to database"""

        query = """
            INSERT INTO district_quotes (
                quote_id,
                district_name,
                contact_email,
                seat_count,
                tier,
                term_months,
                grand_total_cents,
                quote_data,
                status,
                created_at,
                valid_until
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        """

        await self.db.execute(
            query,
            quote["quote_id"],
            quote["district_name"],
            quote["contact_email"],
            quote["subscription"]["seat_count"],
            quote["subscription"]["tier"],
            quote["subscription"]["term_months"],
            int(quote["grand_total"] * 100),
            json.dumps(quote),
            "pending",
            datetime.fromisoformat(quote["created_at"]),
            datetime.fromisoformat(quote["valid_until"])
        )

    async def get_quote(self, quote_id: str) -> Dict:
        """Retrieve quote by ID"""

        query = """
            SELECT quote_data
            FROM district_quotes
            WHERE quote_id = $1
        """

        result = await self.db.fetchrow(query, quote_id)

        if not result:
            return None

        return json.loads(result['quote_data'])

    async def accept_quote(
        self,
        quote_id: str,
        accepted_by: str
    ) -> Dict:
        """Accept quote and create subscription"""

        # Get quote
        quote = await self.get_quote(quote_id)

        if not quote:
            raise ValueError("Quote not found")

        # Check if still valid
        valid_until = datetime.fromisoformat(quote["valid_until"])
        if datetime.utcnow() > valid_until:
            raise ValueError("Quote has expired")

        # Update quote status
        update_query = """
            UPDATE district_quotes
            SET status = 'accepted',
                accepted_at = $1,
                accepted_by = $2
            WHERE quote_id = $3
        """

        await self.db.execute(
            update_query,
            datetime.utcnow(),
            accepted_by,
            quote_id
        )

        # Create subscription (would integrate with Stripe here)
        # Return quote with acceptance details
        quote["status"] = "accepted"
        quote["accepted_at"] = datetime.utcnow().isoformat()
        quote["accepted_by"] = accepted_by

        return quote

    async def generate_quote_pdf(self, quote_id: str) -> bytes:
        """
        Generate PDF version of quote using ReportLab
        """
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib import colors
        from reportlab.lib.enums import TA_CENTER, TA_RIGHT
        import io
        from datetime import datetime

        quote = await self.get_quote(quote_id)

        if not quote:
            raise ValueError("Quote not found")

        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        styles = getSampleStyleSheet()

        # Add custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#FF7B5C'),
            spaceAfter=30,
            alignment=TA_CENTER
        )

        header_style = ParagraphStyle(
            'CustomHeader',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#333333'),
            spaceAfter=12
        )

        # Title
        story.append(Paragraph("AIVO Learning Platform", title_style))
        story.append(Paragraph("Enterprise Quote", styles['Heading2']))
        story.append(Spacer(1, 0.3 * inch))

        # Quote details
        quote_data = [
            ['Quote ID:', quote['quote_id']],
            ['District:', quote['district_name']],
            ['Contact:', quote['contact_email']],
            ['Date:', datetime.now().strftime('%B %d, %Y')],
            ['Valid Until:', quote['valid_until']],
        ]

        quote_table = Table(quote_data, colWidths=[2*inch, 4*inch])
        quote_table.setStyle(TableStyle([
            ('FONT', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONT', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))

        story.append(quote_table)
        story.append(Spacer(1, 0.5 * inch))

        # Subscription Details
        story.append(Paragraph("Subscription Details", header_style))

        sub = quote['subscription']
        subscription_data = [
            ['Tier', 'Seats', 'Term', 'Price/Seat', 'Monthly Total'],
            [
                sub['tier'].title(),
                f"{sub['seat_count']:,}",
                f"{sub['term_months']} months",
                f"${sub['final_price_per_seat']:.2f}/mo",
                f"${sub['monthly_total']:,.2f}"
            ]
        ]

        sub_table = Table(subscription_data, colWidths=[1.5*inch]*5)
        sub_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FF7B5C')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))

        story.append(sub_table)
        story.append(Spacer(1, 0.3 * inch))

        # Total
        total_data = [
            ['Contract Total:', f"${sub['contract_total']:,.2f}"]
        ]

        total_table = Table(total_data, colWidths=[5*inch, 2*inch])
        total_table.setStyle(TableStyle([
            ('FONT', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 14),
            ('TEXTCOLOR', (1, 0), (1, 0), colors.HexColor('#FF7B5C')),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('LINEABOVE', (0, 0), (-1, 0), 2, colors.HexColor('#FF7B5C')),
        ]))

        story.append(total_table)
        story.append(Spacer(1, 0.5 * inch))

        # Terms
        story.append(Paragraph("Terms & Conditions", header_style))
        terms_text = """
        <bullet>•</bullet> Quote valid for 30 days from issue date<br/>
        <bullet>•</bullet> Payment due upon contract execution<br/>
        <bullet>•</bullet> Annual billing available with discount<br/>
        <bullet>•</bullet> Implementation support included<br/>
        <bullet>•</bullet> 24/7 technical support<br/>
        <bullet>•</bullet> FERPA and COPPA compliant<br/>
        """
        story.append(Paragraph(terms_text, styles['Normal']))

        # Build PDF
        doc.build(story)

        # Get PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()

        # Save to file or return bytes
        pdf_filename = f"quote_{quote_id}.pdf"

        return {
            "pdf_bytes": pdf_bytes,
            "filename": pdf_filename,
            "size": len(pdf_bytes),
            "content_type": "application/pdf"
        }
