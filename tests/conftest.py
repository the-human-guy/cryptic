import pytest

from playwright.sync_api import sync_playwright, expect

from tests.cryptic_page import CrypticPage


@pytest.fixture(scope='session')
def cryptic_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://the-human-guy.github.io/cryptic/')
        cryptic = CrypticPage(page)
        expect(cryptic.get_by_text('Github')).to_be_visible()
        yield cryptic
