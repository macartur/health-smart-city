class HealthCentresController < ApplicationController
    def index
        @health_centres = HealthCentre.all
    end
end
