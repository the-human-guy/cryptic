import os
import subprocess

import pytest
from dotenv import load_dotenv
from playwright.sync_api import expect, sync_playwright

from tests.cryptic_page import CrypticPage
from tests.utils import find_project_root

load_dotenv()

CRYPTIC_URL = os.getenv("CRYPTIC_URL", "localhost:8000")


@pytest.fixture(scope="session")
def start_project():
    project_root = find_project_root()
    yield subprocess.run([f"{project_root}/host-web.sh"], shell=True)


@pytest.fixture(scope="session")
def cryptic_page(start_project):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(CRYPTIC_URL)
        cryptic = CrypticPage(page)
        expect(cryptic.get_by_text("Github")).to_be_visible()
        yield cryptic
