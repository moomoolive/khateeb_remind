import scrapy
import json

class canadianAreaCodes(scrapy.Spider):
    name = "scraper"
    start_urls = ["https://www.areacodehelp.com/canada/canada_area_codes.shtml"]

    def parse(self, response):
        table_data = response.css('tr')
        area_codes = table_data.css('a::text').getall()

        codes = []
        for area_code in area_codes:
            if (area_code.isnumeric()):
                codes.append(int(area_code))
        
        codes.sort()
        codes = dict.fromkeys(codes, True)

        with open('../../area_codes.json', 'w') as f:
            json.dump(codes, f)