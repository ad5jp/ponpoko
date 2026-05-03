FROM ubuntu:24.04

# タイムゾーン設定を非対話モードで行う
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Tokyo

# apt並列ダウンロード設定（公式機能）
RUN echo 'Acquire::Queue-Mode "host";' > /etc/apt/apt.conf.d/99parallel \
    && echo 'Acquire::http::Pipeline-Depth "5";' >> /etc/apt/apt.conf.d/99parallel \
    && echo 'APT::Acquire::Retries "3";' >> /etc/apt/apt.conf.d/99parallel

# 基本パッケージとApache、Node.jsのインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    # 基本ツール
    tzdata \
    less \
    vim \
    curl \
    ca-certificates \
    gnupg \
    # Apache
    apache2 \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    # Node.js 20.xのセットアップスクリプトをダウンロードして実行
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    # Node.jsのインストール
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    # キャッシュクリア
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Apache設定
COPY ./project.conf /etc/apache2/sites-available/project.conf
RUN a2dissite 000-default \
    && a2ensite project \
    && a2enmod rewrite

EXPOSE 80

CMD ["/usr/sbin/apachectl", "-D", "FOREGROUND"]
