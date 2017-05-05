require 'json'
require 'rest-client'

ENV["RESOURCE_CATALOGUER_HOST"] ||= 'localhost:3000/'
ENV["DATA_COLLECTOR_HOST"] ||= 'localhost:4000/'

def get_resources
  begin
    response = RestClient.get(
      ENV["RESOURCE_CATALOGUER_HOST"] + "resources/?capability=medical_procedure",
    )
    puts "Success in post data"
  rescue RestClient::Exception => e
    puts "Could not send data: #{e.response}"
  end
  JSON.parse(response.body)
end

def get_values resource_uuid
   begin
    response = RestClient.post(
      ENV["DATA_COLLECTOR_HOST"] + "resources/#{resource_uuid}/data",  {capability: "medical_procedure"}   
    )
    puts "Success in post data"
  rescue RestClient::Exception => e
    puts "Could not send data: #{e.response}"
  end 
  JSON.parse(response.body)
end

resources = get_resources

resources["resources"].each do |resource|
  values = get_values(resource["uuid"])
  puts values
end


# require 'csv'
# require 'json'
# 
# health_centre_csv_path = File.join(__dir__, "csv/health_centres.csv")
# health_centre_types_csv_path = File.join(__dir__, "csv/health_centres_types.csv")
# specialties_csv_path = File.join(__dir__, "csv/specialties.csv")
# types_csv_path = File.join(__dir__, "csv/type.csv")
# data_csv_path = File.join(__dir__, "csv/data.csv")
# 
# puts "Seeding"
# print "HealthCentres: "
# CSV.foreach(health_centre_csv_path, :headers => true) do |row|
#   HealthCentre.create!(cnes: row[0], name: row[1], beds: row[2])
#   print '.'
# end
# puts ""
# 
# if Specialty.count == 0
#  print "Specialties: "
#  CSV.foreach(specialties_csv_path, :headers => false) do |row|
#    Specialty.create!(id: row[0], name: row[1])
#    print '.'
#  end
# end
# puts ""
# 
# if Type.count == 0
#  print "Types: "
#  CSV.foreach(types_csv_path, :headers => false) do |row|
#    Type.create!(id: row[0], name: row[1])
#    print '.'
#  end
# end
# puts ""
# 
# print "Create association between HealthCentres and Types: "
# CSV.foreach(health_centre_types_csv_path, :headers => false) do |row|
#   type = Type.find_by(id: row[1])
#   HealthCentre.find_by(cnes: row[0]).types << type
#   print '.'
# end
# puts ""
# 
# print "Procedures and update HealthCentres: "
# count = 0
# CSV.foreach(data_csv_path, :headers => true) do |row|
#   break if count == 1000
#   specialty_id = row[11].to_i
#   if specialty_id < 10
#    p = Procedure.create!(cnes_id: row[6], specialty_id: specialty_id,
#                          date: Date.parse(row[8]), gender: row[2],
#                          different_district: row[12], lat: row[0], long: row[1])
#    p.cnes.update! lat: row[4], long: row[5]
#    print '.'
#    count += 1
#   end
# end
# 
# print "\nCalculating procedure distance from associated health centre: "
# Procedure.all.each do |a|
#   a.distance = a.calculate_distance
#   a.save!
#   print '.'
# end
# 
# print "\nFinding health centres specialties: "
# HealthCentre.all.each do | health_centre|
#   health_centre.specialties << health_centre.procedures.map(&:specialty).uniq {| x| x.name }
#   health_centre.save!
#   print '.'
# end
# 
