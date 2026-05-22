# pip install playwright pandas asyncio

import asyncio
import pandas as pd
from playwright.async_api import async_playwright

SEARCH_ROLE = "Frontend Developer"
LOCATION = "Remote"

jobs = []

async def scrape_wellfound():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False
        )

        page = await browser.new_page()

        # Open Wellfound jobs page
        url = f"https://wellfound.com/jobs"

        await page.goto(url, timeout=60000)

        # Wait for page load
        await page.wait_for_timeout(5000)

        # Search role
        try:
            await page.fill('input[placeholder*="Search"]', SEARCH_ROLE)
            await page.keyboard.press("Enter")
            await page.wait_for_timeout(4000)
        except:
            print("Search box not found")

        # Scroll to load more jobs
        for _ in range(5):
            await page.mouse.wheel(0, 5000)
            await page.wait_for_timeout(2000)

        # Extract jobs
        job_cards = await page.query_selector_all('a[href*="/jobs/"]')

        seen = set()

        for card in job_cards:
            try:
                href = await card.get_attribute("href")

                if not href or href in seen:
                    continue

                seen.add(href)

                title = await card.inner_text()

                full_link = f"https://wellfound.com{href}"

                jobs.append({
                    "title": title.strip(),
                    "link": full_link
                })

            except Exception as e:
                print("Error:", e)

        await browser.close()

asyncio.run(scrape_wellfound())

# Save to CSV
df = pd.DataFrame(jobs)
df.to_csv("wellfound_jobs.csv", index=False)

print(f"Saved {len(df)} jobs to wellfound_jobs.csv")
print(df.head())