class CreateYears < ActiveRecord::Migration
  def change
    create_table :years do |t|
      t.integer :content, null: false
      t.string :name, null: false
    end
  end
end
