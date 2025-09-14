package com.bank.account.repository;

import com.bank.account.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findBySourceAccountOrDestinationAccountOrderByTimestampDesc(String sourceAccount, String destinationAccount);
    List<Transaction> findBySourceAccountOrderByTimestampDesc(String sourceAccount);
    List<Transaction> findByDestinationAccountOrderByTimestampDesc(String destinationAccount);
}
