Rails.application.routes.draw do
  root 'home#index'
  get 'commonjs' => 'home#commonjs'
end
