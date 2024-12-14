from playwright.sync_api import expect


def test_can_encrypt_file(cryptic_page):
    expect(cryptic_page.get_by_text('Github')).to_be_visible()
    cryptic_page.click("//*[@data-testid='create-new-file-btn']")
    expect(cryptic_page.get_by_test_id('crypto-algo-selector')).to_be_visible()