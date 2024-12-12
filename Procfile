web: vendor/bin/heroku-php-apache2 public/
release: php artisan clear-compiled && php artisan optimize && php artisan storage:link && chmod -R 775 storage && php artisan cache:clear
