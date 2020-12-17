import scrapy

class canadianAreaCodes(scrapy.Spider):
    name = "scraper"
    start_urls = ["https://www.areacodehelp.com/canada/canada_area_codes.shtml"]

    def parse(self, response):
        table_data = response.css('tr')
        area_codes = table_data.css('a::text').getall()

        for area_code in area_codes:
            if (area_code.isnumeric()):
                yield { 'code': area_code }