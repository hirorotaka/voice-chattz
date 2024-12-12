web: vendor/bin/heroku-php-apache2 public/
release: php artisan clear-compiled && php artisan optimize && php artisan config:cache && php artisan route:cache && php artisan view:cache
