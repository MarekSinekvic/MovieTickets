<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241118121433 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media (id SERIAL NOT NULL, movie_id INT DEFAULT NULL, uri VARCHAR(2048) NOT NULL, content_type VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6A2CA10C8F93B6FC ON media (movie_id)');
        $this->addSql('CREATE TABLE tag (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE tag_movie (tag_id INT NOT NULL, movie_id INT NOT NULL, PRIMARY KEY(tag_id, movie_id))');
        $this->addSql('CREATE INDEX IDX_3FB2EB69BAD26311 ON tag_movie (tag_id)');
        $this->addSql('CREATE INDEX IDX_3FB2EB698F93B6FC ON tag_movie (movie_id)');
        $this->addSql('ALTER TABLE media ADD CONSTRAINT FK_6A2CA10C8F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tag_movie ADD CONSTRAINT FK_3FB2EB69BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tag_movie ADD CONSTRAINT FK_3FB2EB698F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE movie ADD preview_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE movie ADD CONSTRAINT FK_1D5EF26FCDE46FDB FOREIGN KEY (preview_id) REFERENCES media (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1D5EF26FCDE46FDB ON movie (preview_id)');
        $this->addSql('ALTER TABLE show ADD begin_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE show ADD end_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE movie DROP CONSTRAINT FK_1D5EF26FCDE46FDB');
        $this->addSql('ALTER TABLE media DROP CONSTRAINT FK_6A2CA10C8F93B6FC');
        $this->addSql('ALTER TABLE tag_movie DROP CONSTRAINT FK_3FB2EB69BAD26311');
        $this->addSql('ALTER TABLE tag_movie DROP CONSTRAINT FK_3FB2EB698F93B6FC');
        $this->addSql('DROP TABLE media');
        $this->addSql('DROP TABLE tag');
        $this->addSql('DROP TABLE tag_movie');
        $this->addSql('DROP INDEX UNIQ_1D5EF26FCDE46FDB');
        $this->addSql('ALTER TABLE movie DROP preview_id');
        $this->addSql('ALTER TABLE show DROP begin_date');
        $this->addSql('ALTER TABLE show DROP end_date');
    }
}
