import { test, expect } from '@playwright/test';

test.describe('アプリケーション基本フロー', () => {
  test('ウェルカムページから始まり、名前を入力してホームに遷移できる', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('/');

    // スクリーンショット: ウェルカムページ（日本語）
    await page.screenshot({ path: 'tests/screenshots/welcome-page-ja.png', fullPage: true });

    // ウェルカムメッセージが表示されることを確認
    await expect(page.locator('h1')).toContainText('えいごをまなぼう！');

    // 言語切り替えボタンが存在する
    const langButton = page.getByText('English');
    await expect(langButton).toBeVisible();

    // 英語に切り替え
    await langButton.click();
    await expect(page.locator('h1')).toContainText('Welcome to English Learning!');

    // スクリーンショット: ウェルカムページ（英語）
    await page.screenshot({ path: 'tests/screenshots/welcome-page-en.png', fullPage: true });

    // 日本語に戻す
    await page.getByText('日本語').click();

    // 名前入力フィールドのテスト
    const nameInput = page.getByPlaceholder('なまえをいれてね');
    const startButton = page.getByText('あそぼう！');

    // 初期状態でボタンが無効
    await expect(startButton).toBeDisabled();

    // 名前を入力
    await nameInput.fill('たろう');
    await expect(startButton).toBeEnabled();

    // スクリーンショット: 名前入力後
    await page.screenshot({ path: 'tests/screenshots/welcome-page-with-name.png', fullPage: true });

    // スタートボタンをクリックしてホームページへ
    await startButton.click();

    // ホームページに遷移したことを確認
    await expect(page).toHaveURL('/home');
    await expect(page.locator('h1')).toContainText('こんにちは, たろう! 👋');

    // スクリーンショット: ホームページ
    await page.screenshot({ path: 'tests/screenshots/home-page.png', fullPage: true });
  });

  test('ホームページでゲームカードが表示され、クリック可能', async ({ page }) => {
    // LocalStorageに名前を設定してホームページに直接アクセス
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('userName', 'はなこ');
    });
    await page.goto('/home');

    // ユーザー名が表示される
    await expect(page.locator('h1')).toContainText('こんにちは, はなこ! 👋');

    // ゲームカードが3つ表示される
    const gameCards = page.locator('button[aria-label*="Play"]');
    await expect(gameCards).toHaveCount(3);

    // 各ゲームカードの存在確認
    await expect(page.getByText('アルファベット')).toBeVisible();
    await expect(page.getByText('ぶんしょう れんしゅう')).toBeVisible();
    await expect(page.getByText('おはなし')).toBeVisible();

    // ゲームカードのホバー効果を確認（視覚的確認用）
    const alphabetCard = page.getByRole('button', { name: /Play アルファベット game/ });
    await alphabetCard.hover();
    await page.waitForTimeout(500); // アニメーション待機

    // スクリーンショット: ゲームカードホバー時
    await page.screenshot({ path: 'tests/screenshots/game-card-hover.png', fullPage: true });

    // 進捗ボタンの確認
    const progressButton = page.getByText(/がくしゅうきろく/);
    await expect(progressButton).toBeVisible();
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    await page.goto('/');

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'tests/screenshots/mobile-welcome.png', fullPage: true });

    await page.goto('/home');
    await page.screenshot({ path: 'tests/screenshots/mobile-home.png', fullPage: true });

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/tablet-welcome.png', fullPage: true });

    await page.goto('/home');
    await page.screenshot({ path: 'tests/screenshots/tablet-home.png', fullPage: true });

    // デスクトップサイズ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/desktop-welcome.png', fullPage: true });
  });

  test('アニメーションとインタラクションの確認', async ({ page }) => {
    await page.goto('/');

    // ページ読み込み時のアニメーション待機
    await page.waitForTimeout(1000);

    // 名前入力のインタラクション
    const nameInput = page.getByPlaceholder('なまえをいれてね');

    // 文字を1文字ずつ入力してリアルタイム性を確認
    await nameInput.type('こんにちは', { delay: 100 });

    // Enterキーでの送信テスト
    await nameInput.press('Enter');

    // ホームページでのアニメーション確認
    await expect(page).toHaveURL('/home');

    // アニメーション完了待機
    await page.waitForTimeout(1500);

    // ゲームカードのクリックアニメーション
    const vocabularyCard = page.getByRole('button', { name: /Play ぶんしょうれんしゅう game/ });
    await vocabularyCard.click({ force: true });

    // ボタンのクリック効果を視覚的に確認
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'tests/screenshots/card-click-animation.png' });
  });

  test('エラーケースの確認', async ({ page }) => {
    await page.goto('/');

    // 空白のみの名前での送信試行
    const nameInput = page.getByPlaceholder('なまえをいれてね');
    const startButton = page.getByText('あそぼう！');

    await nameInput.fill('   ');
    await expect(startButton).toBeDisabled();

    // 直接ホームページにアクセス（名前なし）
    await page.goto('/home');

    // 名前がなくてもエラーにならないことを確認
    await expect(page.locator('h1')).toContainText('こんにちは, ! 👋');
    await page.screenshot({ path: 'tests/screenshots/home-no-name.png' });
  });
});
