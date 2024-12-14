import pytest

from playwright.sync_api import sync_playwright, expect


@pytest.fixture(scope='session')
def cryptic_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto('https://the-human-guy.github.io/cryptic/')
        yield page
