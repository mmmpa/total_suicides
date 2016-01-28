class CreateAttempteds < ActiveRecord::Migration
  def change
    create_table :attempteds do |t|
      t.references :gender, index: true, foreign_key: true, null: false
      t.references :area, index: true, foreign_key: true, null: false
      t.references :year, index: true, foreign_key: true, null: false
      t.integer :yes, null: false
      t.integer :no, null: false
      t.integer :unknown, null: false
    end
  end
end
