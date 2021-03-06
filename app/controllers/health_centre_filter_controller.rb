class HealthCentreFilterController < ApplicationController
  # GET /
  def index
    @health_centres = HealthCentre.all
    @health_centres = @health_centres.sort{|h1, h2|  h1.name.downcase <=> h2.name.downcase }
  end

  # GET health_centre_filter/:health_centre_id/:specialty_id
  def filter_health_centres
    selected_health_centre = HealthCentre.find params[:health_centre_id].to_i
    types = selected_health_centre.types
    @set = Set.new

    types.each do | type|
      @set << type.health_centres.select {|h| h if h.specialty_ids.include?(params[:specialty_id].to_i)}
    end

    render json: @set.to_a[0]
  end
end
