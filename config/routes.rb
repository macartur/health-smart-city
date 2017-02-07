Rails.application.routes.draw do
	root to: 'health_centres#index'
	resources :health_centres
end
